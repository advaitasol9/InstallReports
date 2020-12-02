import { apiPatchAnswers } from '../../core/api';
import { uploadPhoto } from '../../core/fileHandle';
import { clearPhotos } from '../../modules/workActivity/workOrderQuestions/WorkOrderQuestionsState';

export const WORKORDER_QUESTION_ANSWERS_UPDATED = 'workOrderQuestionsAction/WORKORDER_QUESTION_ANSWER_UPDATED';

export function workOrderQuestionAnswerUpdated(payload) {
  return { type: WORKORDER_QUESTION_ANSWERS_UPDATED, payload };
}

export function updateWorkOrderQuestionAnswers(id, answerData, token) {
  return async dispatch => {
    let { photos, answers, signature, deleted_photos } = answerData;

    answers = answers.map(question => {
      if (question.type == 'photo') {
        deleted_photos.forEach(photo => {
          const index = question.answers.indexOf(photo);
          if (index != -1) {
            question.answers.splice(index, 1);
          }
        });
      } else if (question.allow_photos) {
        deleted_photos.forEach(photo => {
          const index = question.photo.indexOf(photo);
          if (index != -1) {
            question.photo.splice(index, 1);
          }
        });
      }
      return question;
    });

    const promises = photos.map(async item => {
      const fileRes = await uploadPhoto(item.uri, token);
      answers.forEach((question, index) => {
        if (question.order === item.order) {
          if (question.type == 'photo') {
            answers[index].answers = [...(answers[index].answers ?? []), fileRes.data.id];
          } else {
            answers[index].photo = [...(answers[index].photo ?? []), fileRes.data.id];
          }
        }
      });
      return { ...fileRes.data, order: item.order };
    });

    const uploadedPhotos = await Promise.all(promises);

    const signatureQuestionIndex = answers.findIndex(item => item.type == 'signature');
    if (signature && signatureQuestionIndex !== -1) {
      const fileRes = await uploadPhoto(signature, token);
      answers[signatureQuestionIndex].answers = fileRes.data.id;
    }

    const temp = await apiPatchAnswers(`activities/${id}`, { installer_questions_answers: JSON.stringify(answers) }, token);
    dispatch(workOrderQuestionAnswerUpdated({ id, installer_questions_answers: answers }));

    return { answers, photos: uploadedPhotos };
  };
}
