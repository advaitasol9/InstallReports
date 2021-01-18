import RNFetchBlob from 'rn-fetch-blob';
import { apiChangeStatus, apiGet, apiGetJson, apiPatch, apiPostComment, apiPostImage } from '../../core/api';
import { uploadCommentFile } from '../../core/fileHandle';
import { saveCommentsOffline } from '../../modules/offlineWorkorderState';

export const WORKORDER_STATUS_CHANGED = 'workOrderPreInsatllAction/WORKORDER_STATUS_CHANGED';
export const WORKORDER_GEO_LOCATION_CHANGED = 'workOrderPreInstallAction/WORKORDER_GEO_LOCATION_CHANGED';
export const WORKORDER_COMMENT_UPDATED = 'workOrderPreInstallAction/WORKORDER_COMMENT_UPDATED';

function workOrderStatusChanged(payload) {
  return { type: WORKORDER_STATUS_CHANGED, payload };
}

function workOrderGeoLocationChanged(payload) {
  return { type: WORKORDER_GEO_LOCATION_CHANGED, payload };
}

function workOrderCommentChanged(payload) {
  return { type: WORKORDER_COMMENT_UPDATED, payload };
}

export function updateWorkOrderStatus(id, status, token) {
  return dispath => {
    return apiChangeStatus(status, id, token)
      .then(() => dispath(workOrderStatusChanged({ id, status })))
      .catch(error => console.log(error));
  };
}

export function updateWorkOrderGeoLocation(id, geoLocations, token) {
  return dispatch => {
    return apiPatch(`activities/` + id, token, {
      geo_locations: JSON.stringify(geoLocations)
    })
      .then(() => dispatch(workOrderGeoLocationChanged({ id, geo_locations: geoLocations })))
      .catch(error => console.error(error));
  };
}

export function updateWorkOrderComment(id, comment, token) {
  return async dispatch => {
    const resPostText = await apiPostComment(`spectrum/activities/${id}/comments`, comment.text, token);
    const promises = comment.photos.map(async item => {
      try {
        const { data } = await uploadCommentFile(item, resPostText.data.id, id, token);
        return { ...data, local_path: item };
      } catch (e) {
        return false;
      }
    });
    const savedFiles = await Promise.all(promises);
    const { data } = await apiGetJson(
      `activities/${id}/comments?search={"fields":[{"operator":"equals","value":"${resPostText.data.id}","field":"id"}]}`,
      token
    );

    dispatch(workOrderCommentChanged({ id, comment: { ...data[0], files: savedFiles, activityId: id } }));
  };
}
