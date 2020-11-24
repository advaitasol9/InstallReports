import { apiPatch, apiPostComment } from '../../core/api';
import { uploadCommentFile } from '../../core/fileHandle';

export const WORKORDER_FAILED_ATTEMPT_UPDATED = 'WorkOrderFailedAttemptAction/WORKORDER_FAILED_ATTEMPT_UPDATED';

function workOrderFailedAttemptUpdated(payload) {
  return { type: WORKORDER_FAILED_ATTEMPT_UPDATED, payload };
}

export function saveWorkOrderFailedAttempts(workOrderId, { comment, photos, signature, managerName }, token) {
  return async dispatch => {
    const resPostText = await apiPostComment(`spectrum/activities/${workOrderId}/comments`, comment, token);

    await apiPatch(`activities/` + workOrderId, token, {
      failed_installation_manager_name: managerName,
      failed_installation_comment_id: resPostText.data.id
    });

    let promises = (photos ?? []).map(photo => {
      return uploadCommentFile(photo, resPostText.data.id, workOrderId, token);
    });

    if (signature) {
      promises.push(uploadCommentFile(signature, resPostText.data.id, workOrderId, token));
    }

    await Promise.all(promises);

    dispatch(workOrderFailedAttemptUpdated({ id: workOrderId, comment_id: resPostText.data.id, manager_name: managerName }));
  };
}
