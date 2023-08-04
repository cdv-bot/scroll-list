import { useRef } from 'react';
import './App.css';
import Wrapper from './Wrapper';

function App() {
  const ref = useRef();

  const onChange = e => {
    ref.current.submit({ q: e.target.value });
  };

  return (
    <>
      <input onChange={onChange} />
      <Wrapper
        ref={ref}
        keyApi="scroll"
        url="api/products/search"
        onConvertData={data => data?.products}>
        {({ data }) => {
          return data.map((item, id) => {
            return <div key={id}>{item.title}</div>;
          });
        }}
      </Wrapper>
    </>
  );
}

export default App;
