export const ERROR_MESSAGES = {
  AUTH: {
    NOT_AUTH: 'Не авторизован',
  },
  USER: {
    EXISTS: 'Пользователь с таким email или username уже зарегистрирован',
    EXISTS_NAME: 'Пользователь с таким username уже зарегистрирован',
    EXISTS_EMAIL: 'Пользователь с таким email уже зарегистрирован',
    NOT_FOUND: 'Пользователь не найден',
    NOT_CORRECT: 'Передан не верный пароль или username',
  },
  VALIDATION: {
    NOT_EMPTY: 'Поле не должно быть пустым',
    IS_NUMBER: 'Значение должно иметь тип Number',
    IS_URL: 'Некорректный формат ссылки {0}',
    IS_EMAIL: 'Некорректный формат почты',
    TEXT_LENGTH: 'Поле должно иметь от {0} до {1} символов',
    MIN_LENGTH_PASS: 'Минимальная длина пароля 6 символов',
    MIN_PRICE: 'Минимальное значение цены {0} руб',
  },
  OFFER: {
    IS_COMPLETE: 'На подарок деньги уже собраны',
    MUCH_PRICE:
      'Превышает стоимость подарка в общей сложности. Уменьшите взнос',
    MIN: 'Минимальная сумма 1 руб',
    NOT_FOUND: 'Предложений скинуться на подарок не найдено',
    SELF_OFFER: 'Нельзя вносить деньги на свой подарок',
  },
  WISH: {
    NOT_FOUND: 'Подарок не найден',
    EMPTY: 'Подарки не найдены',
    OWNER_COPY: 'Нельзя скопировать свой подарок',
    DELETE_ANOTHER: 'Попытка удалить не свой подарок',
    EDIT_ANOTHER: 'Попытка изменить не свой подарок',
    HAS_OFFER: 'Подарок нельзя удалить, есть скинувшиеся на подарок',
    NOT_EDIT_PRICE:
      'Нельзя изменить цену, когда уже есть скинувшиеся на подарок',
  },
  WISHLIST: {
    NOT_FOUND: 'Коллекция не найдена',
  },
} as const;

export const DEFAULT_VALUES = {
  USER: {
    ABOUT: 'Пока ничего не рассказал о себе',
    AVATAR: 'https://i.pravatar.cc/300',
  },
} as const;

export const NAME_LOCAL_AUTH_GUARD = 'LOCAL_AUTH_GUARD';

export const NAME_JWT_AUTH_GUARD = 'JWT_AUTH_GUARD';

export const IS_PUBLIC_KEY = 'isPublic';
