import queryString from 'query-string';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import axios from 'axios';
let ajaxRequest = null;
const abortController = new AbortController();
const Wrapper = forwardRef(function Wrapper(
  { children: Children, url, defaultPayload = {}, onConvertData },
  ref
) {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const wrapperScroll = useRef();

  const isCallApi = useRef(false);
  const isScroll = useRef(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState();
  const payload = useRef({
    skip: 1,
    ...defaultPayload
  });

  const handleLoading = isLoading => {
    setLoading(isLoading);
  };
  const fetchData = async () => {
    try {
      if (ajaxRequest) {
        ajaxRequest.cancel();
      }

      // creates a new token for upcomming ajax (overwrite the previous one)
      ajaxRequest = axios.CancelToken.source();
      handleLoading(true);
      console.log(source);
      // if (abortController) abortController.abort();
      const { data } = await axios.get(
        `${url}?${queryString.stringify(payload.current)}`,
        {
          cancelToken: ajaxRequest.token

          // signal: abortController.signal
        }
      );
      source.cancel('Request canceled due to new search query');
      const dataApi = onConvertData?.(data) ?? data;
      isCallApi.current = false;
      if (isScroll.current)
        return setDataSource(prevData => [...prevData, ...dataApi]);
      setDataSource(dataApi);
    } catch (error) {
      console.log(error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    submit(value) {
      isScroll.current = false;

      payload.current = {
        ...payload.current,
        ...value
      };
      wrapperScroll.current.scrollTo({ top: 0, behavior: 'smooth' });
      fetchData();
    }
  }));

  useEffect(() => {
    const onScroll = event => {
      let maxScroll = event.target.scrollHeight - event.target.clientHeight;
      let currentScroll = event.target.scrollTop;
      console.log(isCallApi.current);
      if (currentScroll === maxScroll && !isCallApi.current) {
        isCallApi.current = true;
        isScroll.current = true;
        payload.current = {
          ...payload.current,
          skip: payload.current.skip + 10
        };
        fetchData();
      }
    };
    wrapperScroll.current.addEventListener('scroll', onScroll);
    return () => {
      wrapperScroll.current.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div>
      <div ref={wrapperScroll} style={{ height: '200px', overflow: 'auto' }}>
        <Children data={dataSource || []} />
      </div>
      <div style={{ height: 10 }}>{loading && 'loading'}</div>
    </div>
  );
});

export default Wrapper;
