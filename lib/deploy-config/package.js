Package.describe({
  summary: "Trix for managing Meteor deployment configurations"
});

Package.on_use(function (api) {
  api.add_files('server.js', 'server');
});
