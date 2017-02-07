import React from 'react';
import CC from '../cc/cc';
import Link from '../link/link';
import Container from '../container/container';
import Icon from '../../assets/icon-square-small.svg';
import './footer-style';

export default (props) => {
  return (
    <footer className="footer">
      <Container className="footer__inner">
        <section className="footer__left">
          <Link className="footer__link" to="/guides/get-started">起步</Link>
          <Link className="footer__link" to="/organization">组织</Link>
          <Link className="footer__link" to="/contribute">贡献</Link>
          <Link className="footer__link" to="/guides/why-webpack#comparison">比较</Link>
        </section>

        <section className="footer__middle">
          <Link to="/" className="footer__icon">
            <img src={ Icon } />
          </Link>
        </section>

        <section className="footer__right">
          <Link className="footer__link" to="/branding">品牌</Link>
          <Link className="footer__link" to="//gitter.im/webpack/webpack">支持</Link>
          <Link className="footer__link" to="https://github.com/webpack/webpack/releases">更新日志</Link>
          <Link className="footer__link" to="/license">遵循协议</Link>
          <Link className="footer__link">粤ICP备17008907号</Link>
          <CC />
        </section>
      </Container>
    </footer>
  );
};
