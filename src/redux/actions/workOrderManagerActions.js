import { apiPatchAnswers } from '../../core/api';
import { uploadPhoto } from '../../core/fileHandle';

export const WORKORDER_MANAGER_ANSWERS_UPDATED = 'workOrderManagerAction/WORKORDER_MANAGER_ANSWERS_UPDATED';

export function workOrderManagerAnswersUpdated(payload) {
  return { type: WORKORDER_MANAGER_ANSWERS_UPDATED, payload };
}

export function saveManagerQuestionAnswers(id, { answers, photos, signature }, token) {
  return async dispatch => {
    if (photos.length) {
      const promises = photos.map(async photo => {
        const fileRes = await uploadPhoto(photo.uri, token);

        answers.forEach((question, index) => {
          if (question.order == photo.order) {
            if (question.type == 'photo') {
              answers[index].answers = [...(answers[index].answers ?? []), fileRes.data.id];
            } else {
              answers[index].photo = [...(answers[index].photo ?? []), fileRes.data.id];
            }
          }
        });
      });

      await Promise.all(promises);
    }

    const signatureQuestionIndex = answers.findIndex(question => question.type == 'signature');
    if (signature && signatureQuestionIndex != -1) {
      const fileRes = await uploadPhoto(signature, token);
      answers[signatureQuestionIndex].answers = fileRes.data.id;
    }

    await apiPatchAnswers(
      `activities/${id}`,
      {
        manager_questions_answers: JSON.stringify(answers)
      },
      token
    );

    dispatch(workOrderManagerAnswersUpdated(answers));
  };
}
