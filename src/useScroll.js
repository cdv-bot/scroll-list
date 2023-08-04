import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

function useScroll(key, api) {
  const { data } = useQuery([key], () => fetch(api).then(req => req.json()));
  return { data };
}

export default useScroll;
