const models: { name: string; model: any }[] = [
  { name: 'userModel', model: require('../../models/User').default },
  { name: 'mapStatusModel', model: require('../../models/MapStatus').default },
  { name: 'mapRequestModel', model: require('../../models/MapRequest').default },
];

export default models;