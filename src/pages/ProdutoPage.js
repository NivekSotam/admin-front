import {  useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Modal, Image, Input, Button } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CustomHeader from '../components/header';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProdutoPage = () => {
  const { id } = useParams();
  const [produtoRepo, setProdutoRepo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [freteValue, setFreteValue] = useState('');
  const [freteResult, setFreteResult] = useState(null);

  const getProduto = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/produto/${id}`);
      setProdutoRepo(data);
    } catch (error) {
      throw new Error(error);
    }
  }, [id]);

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleFreteCalculate = async () => {
    try {
      const { data } = await axios.post('https://frete-api.herokuapp.com/calcular', {
        cep: freteValue,
        peso: produtoRepo.peso,
        altura: produtoRepo.altura,
        largura: produtoRepo.largura,
        comprimento: produtoRepo.comprimento,
      });
      setFreteResult(data);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getProduto();
  }, [getProduto]);

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
                <Paragraph style={{ fontSize: '16px', marginBottom: '24px', color: '#555' }}>
                  {produtoRepo.descricao}
                </Paragraph>
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                  <Col span={12}>
                    <Title level={4} style={{ fontWeight: 'bold' }}>
                      R$ {produtoRepo.valor}
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Title level={4} style={{ color: 'green', fontWeight: 'bold' }}>
                      6x de R$ {parseFloat(produtoRepo.valor / 6).toFixed(2)}
                    </Title>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={16}>
                    <Input
                      placeholder="Digite o CEP"
                      value={freteValue}
                      onChange={(e) => setFreteValue(e.target.value)}
                      style={{ marginRight: '16px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Button type="primary" onClick={handleFreteCalculate}>
                      Calcular Frete
                    </Button>
                  </Col>
                </Row>
                {freteResult && (
                  <Paragraph style={{ fontSize: '16px', marginTop: '12px' }}>
                    Valor do frete: R$ {freteResult.valor}
                  </Paragraph>
                )}
              </Col>
            </Row>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ProdutoPage;
