const userNotFoundMsg = 'Пользователь не найден';
const incorrectObjIdMsg = 'Неверный формат ID';
const existingUserMsg = (email) => `Пользователь ${email} уже существует`;
const sourceNotFoundMsg = 'Запрашиваемый ресурс не найден';
const wrongEmailOrPasswordMsg = 'Неправильные почта или пароль';
const unauthorisedArticleDeleteMsg = 'Вы пытаетесь удалить чужую статью';
const successArticleDeleteMsg = 'Статья успешно удалена';
const emptyPasswordMsg = 'Введите пароль';
const emptyEmailMsg = 'Введите email';
const authNeededMsg = 'Необходима авторизация';
const serverErrorMsg = 'На сервере произошла ошибка';
const incorrectUrlMsg = 'Введите корректный URL';

const existingEmailErrCode = 11000;

module.exports = {
  userNotFoundMsg,
  incorrectObjIdMsg,
  existingUserMsg,
  sourceNotFoundMsg,
  existingEmailErrCode,
  wrongEmailOrPasswordMsg,
  unauthorisedArticleDeleteMsg,
  successArticleDeleteMsg,
  emptyPasswordMsg,
  emptyEmailMsg,
  authNeededMsg,
  serverErrorMsg,
  incorrectUrlMsg,
};
