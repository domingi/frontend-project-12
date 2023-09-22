import { useTranslation } from 'react-i18next';

function BuildPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>404</h1>
      <h2>{t('other.404')}</h2>
    </>
  );
}

export default BuildPage;
