import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Importar

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const { t } = useTranslation(); // 2. Inicializar o hook

    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const handleInputChange = (e) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);
        if (newKeyword === '') {
            navigate('/');
        }
    }

    return (
        <Form onSubmit={submitHandler} className="d-flex">
            <Form.Control
                type='text'
                name='q'
                onChange={handleInputChange}
                value={keyword}
                placeholder={t('searchPlaceholder')} // 3. Usar a tradução
                className='me-sm-2 ms-sm-5'
            ></Form.Control>
            <Button type='submit' variant='outline-success' className='p-2'>
                {t('searchButton')} {/* 3. Usar a tradução */}
            </Button>
        </Form>
    );
};

export default SearchBox;