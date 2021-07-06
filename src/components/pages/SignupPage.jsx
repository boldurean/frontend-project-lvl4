import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth.js';
import routes from '../../routes.js';

const SignupPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const [userCreated, setUserCreated] = useState(false);
  const [userExisting, setUserExisting] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .min(3, t('errors.fromTo', { min: 3, max: 20 }))
        .max(20, t('errors.fromTo', { min: 3, max: 20 }))
        .required(t('errors.required')),
      password: yup
        .string()
        .min(6, t('errors.from', { min: 6 }))
        .required(t('errors.required')),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], t('errors.matchPassword'))
        .required(t('errors.required')),
    }),
    onSubmit: async (values) => {
      setUserCreated(false);
      setUserExisting(false);
      try {
        const res = await axios.post(routes.signupPath(), values);
        console.log(res);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setUserCreated(true);
          return;
        }
        if (err.isAxiosError && err.response.status === 409) {
          setUserExisting(true);
          formik.errors.passwordConfirmation = t('errors.userExists');
          return;
        }
        throw err;
      }
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container fluid className="h-100">
      <Row bsPrefix="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70"
                  height="70"
                  fill="currentColor"
                  className="bi bi-person-lines-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                </svg>
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('texts.register')}</h1>
                <FloatingLabel
                  controlId="floatingInput"
                  label={t('forms.username')}
                  className="mb-3"
                >
                  <Form.Control
                    name="username"
                    ref={inputRef}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    placeholder={t('forms.username')}
                    isInvalid={!!formik.errors.username || userCreated || userExisting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  controlId="floatingPassword1"
                  label={t('forms.password')}
                >
                  <Form.Control
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    type="password"
                    placeholder={t('forms.password')}
                    isInvalid={!!formik.errors.password || userCreated || userExisting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  controlId="floatingPassword2"
                  label={t('forms.passwordConfirmation')}
                >
                  <Form.Control
                    name="passwordConfirmation"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passwordConfirmation}
                    type="password"
                    placeholder={t('forms.passwordConfirmation')}
                    isInvalid={!!formik.errors.passwordConfirmation || userCreated || userExisting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.passwordConfirmation}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button className="w-100 mb-3" variant="outline-primary" type="submit">
                  {t('buttons.signup')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default SignupPage;
