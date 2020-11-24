import RNFetchBlob from 'rn-fetch-blob';
import { apiChangeStatus, apiGet, apiPatch, apiPostComment, apiPostImage } from '../../core/api';

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
        const res = await apiGet('aws-s3-presigned-urls', token);
        await RNFetchBlob.fetch(
          'PUT',
          res.data.url,
          {
            'security-token': token,
            'Content-Type': 'application/octet-stream'
          },
          RNFetchBlob.wrap(decodeURI(item.replace('file://', '')))
        );
        const stats = await RNFetchBlob.fs.stat(decodeURI(item.replace('file://', '')));
        const formData = new FormData();
        formData.append('file_type', 'image/jpeg');
        formData.append('name', stats.filename);
        formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
        formData.append('size', stats.size);

        return apiPostImage(`activities/${id}/comments/${resPostText.data.id}/files`, formData, token);
      } catch (e) {
        return false;
      }
    });
    await Promise.all(promises);
    return dispatch(workOrderCommentChanged({ id, comment }));
  };
}
