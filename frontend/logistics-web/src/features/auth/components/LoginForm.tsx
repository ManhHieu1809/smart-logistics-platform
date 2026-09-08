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

interface DemoAccount {
  role: string;
  email: string;
  badge: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'Admin', email: 'admin@smartlogistics.io', badge: 'Quản trị' },
  { role: 'Operator', email: 'operator@smartlogistics.io', badge: 'Điều phối' },
  { role: 'Warehouse', email: 'warehouse@smartlogistics.io', badge: 'Thủ kho' },
  { role: 'Driver', email: 'driver@smartlogistics.io', badge: 'Tài xế' },
];

export function LoginForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'operator@smartlogistics.io',
      password: 'Password@123',
      rememberMe: true,
    },
  });

  const handleSelectDemo = (account: DemoAccount) => {
    setValue('username', account.email, { shouldValidate: true });
    setValue('password', 'Password@123', { shouldValidate: true });
  };

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
      {/* Demo Credentials Quick Switcher */}
      <div className={styles.demoBox}>
        <span className={styles.demoLabel}>Tài khoản mẫu thử nghiệm (1 chạm):</span>
        <div className={styles.demoChips}>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              className={styles.demoChip}
              onClick={() => handleSelectDemo(acc)}
            >
              <span className={styles.demoRoleName}>{acc.role}</span>
              <span className={styles.demoBadge}>{acc.badge}</span>
            </button>
          ))}
        </div>
      </div>

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
