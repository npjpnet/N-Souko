import type { NextPage } from 'next';

import styles from '../styles/layout.module.scss';

const Layout = ({
  title,
  children,
}: {
  title?: string;
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.header_title}>{title ? title : 'N-Souko'}</div>
      </div>
      <div className={styles.main}>{children}</div>
      {/* <div>footer</div> */}
    </div>
  );
};

export default Layout;
