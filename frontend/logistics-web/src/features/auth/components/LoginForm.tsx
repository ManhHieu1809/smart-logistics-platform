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
        label="Email hoặc Tên đăng nhập"
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
              placeholder="Nhập email tài khoản"
              autoComplete="username"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
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
              placeholder="Nhập mật khẩu truy cập"
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
              Ghi nhớ phiên đăng nhập
            </Checkbox>
          )}
        />

        <Link
          href="#"
          className={styles.forgotPassword}
        >
          Quên mật khẩu?
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
        Đăng Nhập Vào Hệ Thống
      </Button>

      <div className={styles.footer}>
        <Text type="secondary">
          Cần hỗ trợ phân quyền?{' '}
          <Link href="#">
            Liên hệ quản trị viên (Admin)
          </Link>
        </Text>
      </div>
    </Form>
  );
}
