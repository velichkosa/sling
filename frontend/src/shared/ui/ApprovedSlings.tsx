import React from 'react';
import styled from 'styled-components';

interface Sling {
  id: string;
  name: string;
  image: string;
}

interface ApprovedSlingsProps {
  slings: Sling[];
}

const ApprovedSlings: React.FC<ApprovedSlingsProps> = ({ slings }) => {
  return (
    <SlingsWrapper>
      <h3>Используемые стропы</h3>
      <SlingsGrid>
        {slings.map((sling) => (
          <SlingCard key={sling.id}>
            <SlingImage src={sling.image} alt={sling.name} />
            <SlingName>{sling.name}</SlingName>
          </SlingCard>
        ))}
      </SlingsGrid>
    </SlingsWrapper>
  );
};

export default ApprovedSlings;

// Styled components
const SlingsWrapper = styled.div`
  width: 100%;
  margin-top: 40px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    text-align: center;
  }
`;

const SlingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  justify-items: center;
`;

const SlingCard = styled.div`
  width: 100px;
  text-align: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SlingImage = styled.img`
  width: 60px;
  height: 100px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SlingName = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  padding: 0;
`;
