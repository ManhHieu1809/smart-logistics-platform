import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

import {
  loginSchema,
  type LoginFormValues,
} from '../schemas/login.schema';

import styles from './LoginForm.module.css';

const { Text, Link } = Typography;

export function LoginForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = () => {
    /*
     * Chưa gọi backend tại bước này.
     *
     * Sau khi API authentication tồn tại:
     *
     * Page
     *   ↓
     * useLogin()
     *   ↓
     * authApi.login()
     *   ↓
     * httpClient
     *   ↓
     * API Gateway
     */

    navigate(paths.dashboard);
  };

  return (
    <Form
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <Form.Item
        label="Email or Username"
        validateStatus={errors.username ? 'error' : undefined}
        help={errors.username?.message}
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              placeholder="Enter your email"
              autoComplete="username"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? 'error' : undefined}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              size="large"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          )}
        />
      </Form.Item>

      <div className={styles.options}>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(event) =>
                field.onChange(event.target.checked)
              }
            >
              Remember me
            </Checkbox>
          )}
        />

        <Link
          href="#"
          className={styles.forgotPassword}
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={isSubmitting}
        className={styles.submitButton}
      >
        Sign in
      </Button>

      <div className={styles.footer}>
        <Text type="secondary">
          Need help?{' '}
          <Link href="#">
            Contact your system administrator.
          </Link>
        </Text>
      </div>
    </Form>
  );
}
