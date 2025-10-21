import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer>
            <Container>
                <Row>
                    <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
                        <h5>{t('footer.storeName')}</h5>
                        <p>{t('footer.storeDescription')}</p>
                    </Col>
                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <h5>{t('footer.quickLinks')}</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
                            <li><Link to="/contact">{t('footer.contact')}</Link></li>
                            <li><Link to="/privacy">{t('footer.privacyPolicy')}</Link></li>
                        </ul>
                    </Col>
                    <Col md={4} className="text-center text-md-end">
                        <h5>{t('footer.followUs')}</h5>
                        <a href="#!" className="p-2"><i className="fab fa-twitter fa-lg"></i></a>
                        <a href="#!" className="p-2"><i className="fab fa-facebook-f fa-lg"></i></a>
                        <a href="#!" className="p-2"><i className="fab fa-instagram fa-lg"></i></a>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center py-3 border-top">
                        {t('footer.copyright')} &copy; {t('footer.storeName')} {new Date().getFullYear()}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;