import RNFetchBlob from 'rn-fetch-blob';
import { apiGet, apiPostImage } from './api';

export const uploadPhoto = async (uri, token) => {
  const res = await apiGet('aws-s3-presigned-urls', token);
  await RNFetchBlob.fetch(
    'PUT',
    res.data.url,
    {
      'security-token': token,
      'Content-Type': 'image/jpeg'
    },
    RNFetchBlob.wrap(decodeURI(uri).replace('file://', ''))
  );
  const stats = await RNFetchBlob.fs.stat(decodeURI(uri).replace('file://', ''));

  const formData = new FormData();
  formData.append('file_type', 'image/jpeg');
  formData.append('name', stats.filename);
  formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
  formData.append('size', stats.size);
  const fileRes = await apiPostImage(`files`, formData, token);
  return fileRes;
};

export async function uploadCommentFile(uri, commentId, workOrderId, token) {
  const res = await apiGet('aws-s3-presigned-urls', token);
  await RNFetchBlob.fetch(
    'PUT',
    res.data.url,
    {
      'security-token': token,
      'Content-Type': 'image/png'
    },
    RNFetchBlob.wrap(decodeURI(uri).replace('file://', ''))
  );

  const stats = await RNFetchBlob.fs.stat(decodeURI(uri).replace('file://', ''));

  const formData = new FormData();
  formData.append('file_type', 'image/png');
  formData.append('name', stats.filename);
  formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
  formData.append('size', stats.size);

  return await apiPostImage(`activities/${workOrderId}/comments/${commentId}/files`, formData, token);
}
