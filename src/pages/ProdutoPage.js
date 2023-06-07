import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Modal, Image, Input, Button, Breadcrumb } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CustomHeader from '../components/header';
import CardBase from '../components/card';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import parse from 'html-react-parser';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const ProdutoPage = () => {
  const { id } = useParams();
  const [produtoRepo, setProdutoRepo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parcelas, setParcelas] = useState(1);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [fretePac, setFretePac] = useState(null);
  const [cepDestino, setCepDestino] = useState("");

  const getProduto = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/produto/${id}`);
      setProdutoRepo(data);
    } catch (error) {
      throw new Error(error);
    }
  }, [id]);

  const getProdutosRelacionados = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/produto/${id}`);
      const produtoCategoria = data.categoria;
      const response = await axios.get('http://localhost:81/faculdade/admin/api/produtos');
      const produtos = response.data;
      const produtosRelacionados = produtos.filter(produto => produto.categoria === produtoCategoria);
      setProdutosRelacionados(produtosRelacionados);
    } catch (error) {
      console.warn(error);
    }
  }, [id]);

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const handleParcelasChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 6) {
      setParcelas(value);
    }
  };

  const handleParcelasClick = (value) => {
    setParcelas(value);
  };

  useEffect(() => {
    getProduto();
    getProdutosRelacionados();
  }, [getProduto, getProdutosRelacionados]);

  const handleAdicionarAoCarrinho = (produto) => {
    console.log('Produto adicionado ao carrinho:', produto);
  };

  const CEPVALOR = async () => {
    const tipo_do_frete = 41106;
    const peso = 6;
    const valor = produtoRepo.valor;
    const altura = 6;
    const largura = 20;
    const comprimento = 20;

    try {
      const { data } = await axios.get(
        `http://localhost:81/faculdade/admin/api/calcula-frete/${cepDestino}/${peso}/${valor}/${tipo_do_frete}/${altura}/${largura}/${comprimento}`
      );

      if (data.cServico) {
        const fretePac = data.cServico;
        setFretePac(fretePac);
      } else if (data.erro) {
        const mensagemErro = data.erro;
        console.log(mensagemErro);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const formatDescription = (description) => {
    const formattedDescription = parse(description);
    return formattedDescription;
  };

  return (
    <Layout>
      <CustomHeader />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24 }}>
          <Breadcrumb style={{ marginBottom: '24px' }}>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            {produtoRepo && (
              <Breadcrumb.Item>{produtoRepo.produto}</Breadcrumb.Item>
            )}
          </Breadcrumb>
          {produtoRepo ? (
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Image
                  src={`http://localhost:81/faculdade/admin/fotos/${produtoRepo.imagem}G.jpg`}
                  alt={produtoRepo.produto}
                  onClick={handleImageClick}
                  style={{ cursor: 'pointer', maxWidth: '100%' }}
                />
              </Col>
              <Col span={12}>
                <Title level={3} style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                  {produtoRepo.produto}
                </Title>
                <div style={{ fontSize: '16px', marginBottom: '24px', color: '#555' }}>
                  {formatDescription(produtoRepo.descricao)}
                </div>
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                  <Col span={12}>
                    <Title level={4} style={{ fontWeight: 'bold' }}>
                      R$ {produtoRepo.valor}
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Title level={4} style={{ color: 'green', fontWeight: 'bold' }}>
                      {parcelas}x de R$ {(produtoRepo.valor / parcelas).toFixed(2)}
                      <div style={{ marginTop: '12px' }}>
                        <Button onClick={() => handleParcelasClick(1)}>1x</Button>
                        <Button onClick={() => handleParcelasClick(2)}>2x</Button>
                        <Button onClick={() => handleParcelasClick(3)}>3x</Button>
                        <Button onClick={() => handleParcelasClick(4)}>4x</Button>
                        <Button onClick={() => handleParcelasClick(5)}>5x</Button>
                        <Button onClick={() => handleParcelasClick(6)}>6x</Button>
                      </div>
                    </Title>
                  </Col>
                </Row>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAdicionarAoCarrinho(produtoRepo)}
                    style={{ marginRight: '12px' }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input placeholder="CEP de destino" value={cepDestino} onChange={e => setCepDestino(e.target.value)} style={{ marginRight: '12px' }} />
                    <Button type="primary" onClick={CEPVALOR}>Calcular Frete</Button>
                    {fretePac && (
                      <label style={{ marginLeft: '12px' }}>Valor do Frete: R$ {fretePac.Valor}</label>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <div>
              <Title level={3}>Produto não encontrado</Title>
            </div>
          )}
          {produtosRelacionados.length > 0 && (
            <div>
              <Title level={3} style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                Produtos Relacionados
              </Title>
              <Row gutter={[24, 24]}>
                {produtosRelacionados.map((produto) => (
                  <Col span={6} key={produto.id}>
                    <CardBase produto={produto} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Lojinha do Kevin @2023</Footer>
    </Layout>
  );
};

export default ProdutoPage;
