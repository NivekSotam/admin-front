import { Card, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Meta } = Card;

const CardBase = ({ produto }) => {
  const { produto: nomeProduto, valor, imagem, id } = produto;

  const navigate = useNavigate();

  const handleVerDetalhes = () => {
    navigate(`/produto/${id}`);
  };

  return (
    <Card
      hoverable
      style={{
        width: 240,
        margin: '10px',
      }}
      cover={<img src={`http://localhost:81/faculdade/admin/fotos/${imagem}p.jpg`} alt={nomeProduto} type="image/jpeg" />}
    >
      <Meta title={nomeProduto} description={valor} />
      <Button type="primary" style={{ marginTop: '10px' }} onClick={handleVerDetalhes}>
        Ver Detalhes
      </Button>
    </Card>
  );
};

export default CardBase;
