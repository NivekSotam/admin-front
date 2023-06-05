import { Link, useParams } from 'react-router-dom';
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
  const [parcelas, setParcelas] = useState(1);

  const getProduto = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:81/faculdade/admin/api/produto/${id}`);
      setProdutoRepo(data);
    } catch (error) {
      throw new Error(error);
    }
  }, [id]);

//   const handleFreteCalculate = async () => {
//     try {
//       const { data } = await axios.post('https://frete-api.herokuapp.com/calcular', {
//         cep: freteValue,
//       });
//       setFreteResult(data);
//     } catch (error) {
//       console.warn(error);
//     }
//   };

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const DefinirParcelas = (e) => {
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

                    {/* <Input
                    type="number"
                    min={1}
                    max={6}
                    value={parcelas}
                    onChange={DefinirParcelas}
                    style={{ width: '50px', marginRight: '8px' }}
                  /> */}

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
