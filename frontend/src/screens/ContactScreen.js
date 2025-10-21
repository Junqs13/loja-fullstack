import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactScreen = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.p1')}</p>
      <p>
        <strong>{t('contact.email')}:</strong> contato@lojafullstack.com
      </p>
      <p>
        <strong>{t('contact.phone')}:</strong> (11) 99999-8888
      </p>
      <p>
        <strong>{t('contact.address')}:</strong> Rua da Tecnologia, 123, São Paulo - SP
      </p>
    </div>
  );
};

export default ContactScreen;