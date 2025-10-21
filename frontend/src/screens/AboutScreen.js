import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutScreen = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('about.title')}</h1>
      <p>{t('about.p1')}</p>
      <p>{t('about.p2')}</p>
    </div>
  );
};

export default AboutScreen;