const mapPassportData = (userData = {}) => {
  const obj = {};

  if (Object.keys(userData).length > 0) {
    obj[`${userData.provider}_id`] = userData.id;
    obj.email = null;

    if (userData.emails && userData.emails.length > 0) {
      obj.email = userData.emails[0].value;
    }

    const nameParts = userData.displayName.trim().split(' ');
    obj.first_name = nameParts[0];
    obj.last_name = (nameParts.length > 1) ? nameParts[nameParts.length - 1] : null;
    obj.profile_img = (userData.photos.length > 0) ? userData.photos[userData.photos.length - 1].value : null;
  }

  return obj;
};

export default mapPassportData;
