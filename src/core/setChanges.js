import { Alert } from 'react-native';

const changesInOffline = async (changes, setChanges, setNumOfChanges, comment, activityId, accountId, photos, status) => {
  const changesCopy = changes.slice();
  if (changesCopy.filter(item => item.id === activityId).length === 0) {
    await changesCopy.push({
      id: activityId,
      accountId,
      status: status || null,
      comments: [
        {
          comment,
          photos,
          changeStatus: status || null
        }
      ]
    });
    Alert.alert('No Internet connection', "You're now working offline");
  } else {
    await changesCopy.forEach(item => {
      if (item.id === activityId) {
        item.status = status || item.status || null;
        item.comments.push({
          comment,
          photos,
          changeStatus: status || item.status || null
        });
      }
    });
  }

  await setChanges(changesCopy);
  await setNumOfChanges(changesCopy.length);
};

export default changesInOffline;
