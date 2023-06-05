import { Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import Sider from 'antd/es/layout/Sider';
import CardBase from '../components/card';
import CustomHeader from '../components/header';

const { SubMenu } = Menu;

export const CategoriaPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [repo, setRepo] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const { categorias_id } = useParams();
  const categoriaSelecionada = parseInt(categorias_id);

  const getProdutosCategoria = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:81/faculdade/admin/api/categoria/${categorias_id}`
      );
      setRepo(data);
    } catch (error) {
      throw new Error(error);
    }
  }, [categorias_id]);

  const getCategorias = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/categorias`);

      setCategoria(
        data.map((categoria) => ({
          value: categoria.id,
          label: categoria.categoria,
        }))
      );
    } catch (error) {
      console.warn(error);
    }
  }, []);

  const handleVerDetalhes = (produtoId) => {
    // Lógica para navegar para a página de detalhes do produto
  };

  useEffect(() => {
    getProdutosCategoria();
  }, [getProdutosCategoria]);

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    getProdutosCategoria();
  }, [categorias_id, getProdutosCategoria]);

  return (
    <Layout>
      <CustomHeader />
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Categoria</Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
          <Sider style={{ background: colorBgContainer }} width={200}>
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
          <Content className="site-layout" style={{ padding: '0 50px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {repo.map((produto) => (
                <CardBase
                  key={produto.id}
                  produto={produto}
                  onVerDetalhes={() => handleVerDetalhes(produto.id)}
                />
              ))}
            </div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};
