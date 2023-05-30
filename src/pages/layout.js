import { Layout, theme } from 'antd';
import CardBase from '../components/card';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const { Header, Content, Footer } = Layout;


const BaseLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState([]);

  const getProdutos = useCallback(async () => {
      try {
          setLoading(true);
          const { data } = await axios.get("http://localhost:81/faculdade/admin/api/produtos");
          setRepo(data);  
          console.log(data);

      } catch (error) {
          console.warn(error);
      }
      finally {
          setLoading(false);
      }
  })

  useEffect(() => {
      getProdutos([]);
  }, []);

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
      </Header>

      <Content
        className="site-layout"
        style={{
          padding: '0 50px',
        }}
      >
       
        <p>

          {repo.map(produto => (<CardBase produto={produto.produto}/>))}

        </p>

      </Content>

      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default BaseLayout;