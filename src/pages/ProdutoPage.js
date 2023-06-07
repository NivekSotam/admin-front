import { Link, useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Modal, Image, Input, Button } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CustomHeader from '../components/header';
import CardBase from '../components/card';
import { ShoppingCartOutlined } from '@ant-design/icons'; // Importe o ícone de carrinho de compras
import ReactMarkdown from 'react-markdown';


const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const ProdutoPage = () => {
  const { id } = useParams();
  const [produtoRepo, setProdutoRepo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parcelas, setParcelas] = useState(1);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [fretePac, setFretePac] = useState(null); // Estado para armazenar o valor do frete
  const [cepDestino, setCepDestino] = useState(""); // Estado para armazenar o valor do CEP

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
      const produtoCategoria = data.categoria; // Obtenha a categoria do produto atual
      const response = await axios.get('http://localhost:81/faculdade/admin/api/produtos');
      const produtos = response.data;
      const produtosRelacionados = produtos.filter(produto => produto.categoria === produtoCategoria); // Filtrar produtos com a mesma categoria
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
    const tipo_do_frete = 41106; // Sedex: 40010   |  Pac: 41106
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

  const renderMarkdownToHTML = (markdown) => {
    const lines = markdown.split('\n');
    const html = lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <Title key={index} level={1}>{line.replace('# ', '')}</Title>;
      } else if (line.startsWith('## ')) {
        return <Title key={index} level={2}>{line.replace('## ', '')}</Title>;
      } else if (line.startsWith('### ')) {
        return <Title key={index} level={3}>{line.replace('### ', '')}</Title>;
      } else {
        return <Paragraph key={index}>{line}</Paragraph>;
      }
    });
    return html;
  };

  return (
    <Layout>
      <CustomHeader />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24 }}>
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
              {renderMarkdownToHTML(produtoRepo.descricao)}
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
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAdicionarAoCarrinho(produtoRepo)}
                >
                  Adicionar ao Carrinho
                </Button>
                <div style={{ marginTop: '24px' }}>
                  <Input placeholder="CEP de destino" value={cepDestino} onChange={e => setCepDestino(e.target.value)} />
                  <Button type="primary" onClick={CEPVALOR}>Calcular Frete</Button>
                  {fretePac && (
                    <label style={{ marginLeft: '12px' }}>Valor do Frete: R$ {fretePac.Valor}</label>

                  )}

                </div>
              </Col>
            </Row>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </Content>
      <Content style={{ padding: '0 50px', marginTop: '24px' }}>
        <div style={{ background: '#fff', padding: 24 }}>
          <Title level={3} style={{ marginBottom: '12px' }}>
            Produtos Relacionados
          </Title>
          <Row gutter={[24, 24]}>
            {produtosRelacionados.map((produto) => (
              <Col span={8} key={produto.id}>
                <CardBase produto={produto} />
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Lojinha do Kevin @2023</Footer>
    </Layout>
  );
};

export default ProdutoPage;
