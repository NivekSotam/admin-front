import { Card } from 'antd';
const { Meta } = Card;

export const CardBase = (props) => {
   const { produto } = props;
    return (
        <>
            <Card
                hoverable
                style={{
                    width: 240,
                }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            >
                <Meta title={produto} description="tem nada aqui" />
            </Card>
        </>
    )
}

export default CardBase;