export default {
  "POST /api/list": {
    total: 10,
    data: new Array(10).map((item) => {
      return {
        id: item,
        name: `name${item}`,
      };
    }),
  },
  "POST /api/datas": {
    total: 10,
    data: new Array(10).map((item) => {
      return {
        id: item,
        value: `data${item}`,
      };
    }),
  },
};
