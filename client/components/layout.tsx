import { useAuth0 } from '@auth0/auth0-react';

import styles from '../styles/layout.module.scss';

const Layout = ({
  title,
  children,
}: {
  title?: string;
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.header_top}>
          N-Soukoシステム /{' '}
          {!isLoading && isAuthenticated
            ? `ログイン中 : ${user?.name}`
            : `ログインしてください`}
        </div>
        <div className={styles.header_title}>{title ? title : 'N-Souko'}</div>
      </div>
      <div className={styles.main}>{children}</div>
      {/* <div>footer</div> */}
    </div>
  );
};

export default Layout;
