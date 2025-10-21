import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const userDelete = useSelector(state => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <>
            <h1>{t('header.users')}</h1>
            {loading ? <p>{t('loading')}</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>{t('table.id')}</th>
                            <th>{t('table.name')}</th>
                            <th>{t('table.email')}</th>
                            <th>{t('table.admin')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className='fas fa-check' style={{color: 'green'}}></i>
                                    ) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className='btn-sm'><i className='fas fa-edit'></i></Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen;