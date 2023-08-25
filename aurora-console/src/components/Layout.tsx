import styled from '@emotion/styled';

type Props = {
  title: string;
  children: React.ReactNode;
};

const Title = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1.5rem;
`;

const BlueBlock = styled.div`
  height: 1.5rem;
  width: 4px;
  background-color: blue;
`;

function Layout({ title, children }: Props) {
  return (
    <div style={{ paddingTop: '1rem' }}>
      <Title>
        <BlueBlock />
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 400,
          }}
        >
          {title}
        </h1>
      </Title>
      <div style={{ padding: '1rem 1rem 0 1rem' }}>{children}</div>
    </div>
  );
}

export default Layout;
