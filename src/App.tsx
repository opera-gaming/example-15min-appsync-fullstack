import Amplify from "aws-amplify";
import config from "./aws-exports";
import styled from "styled-components";

Amplify.configure(config);

function App() {
  return <Container>App not implemented! But it will be 😝</Container>;
}

export default App;

const Container = styled.div`
  padding: 12px;
  padding-bottom: 68px;
`;
