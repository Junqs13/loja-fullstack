import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyScreen = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('privacy.title')}</h1>
      <p>{t('privacy.p1')}</p>
      <p>{t('privacy.p2')}</p>
      <p>{t('privacy.p3')}</p>
    </div>
  );
};

export default PrivacyPolicyScreen;