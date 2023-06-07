import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Row, Col } from 'antd';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Sider from 'antd/es/layout/Sider';
import CardBase from '../components/card';
import CustomHeader from '../components/header';

const { SubMenu } = Menu;
const { Content, Footer } = Layout;

const HomePage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [, setLoading] = useState(false);
  const [repo, setRepo] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const navigate = useNavigate();

  const getProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:81/faculdade/admin/api/produtos");
      setRepo(data);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/categorias`);
      setCategoria(data.map(categoria => ({
        value: categoria.id,
        label: categoria.categoria,
      })));
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerDetalhes = (id) => {
    navigate(`/produto/${id}`);
  };

  useEffect(() => {
    getProdutos();
    getCategorias();
  }, []);

  return (
    <Layout>
      <CustomHeader />
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
          <Sider style={{ background: colorBgContainer }} width={200} collapsedWidth={0} breakpoint="md" collapsible>
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
              <SubMenu key="sub1" title="Categorias">
                {categoria.map((categoriaItem) => (
                  <Menu.Item key={categoriaItem.value}>
                    <Link to={`/categoria/${categoriaItem.value}`}>{categoriaItem.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            </Menu>
          </Sider>
          <Content className="site-layout" style={{ padding: '0 24px' }}>
            <div style={{ background: '#fff', padding: 24 }}>
              <Row gutter={[16, 16]}>
                {repo.map(produto => (
                  <Col xs={24} sm={12} md={8} lg={6} key={produto.id}>
                    <CardBase produto={produto} onVerDetalhes={() => handleVerDetalhes(produto.id)} />
                  </Col>
                ))}
              </Row>
            </div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Lojinha do Kevin @2023</Footer>
    </Layout>
  );
};

export default HomePage;
