'use strict';

const Region = require('../models/region');
const User   = require('../models/user');
const Poi    = require('../models/poi');

const Pois = {
  home: {
    handler: async function(request, h) {
      const regions = await Region.find();
      return h.view('home', { title: 'Regions of Interest', regions: regions });
    }
  },
  report: {
    handler: async function(request, h) {
      try {
        const pois = await Pois.find().populate('_id').populate('name').populate('description').populate('costalZone');
        let region_id = pois[0].costalZone
        if (typeof request.params != "undefined") {
            region_id = request.params.region_id;
        }
        const region = await Region.findById( region_id );
        return h.view('report', { title: 'Points of Interest', pois: pois, region: region });
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  editDesc: {
    handler: async function(request, h) {
      try {
        const region_id = request.params.region_id;
        const pois_id   = request.params.pois_id;
        const pois = await Pois.findById( pois_id );
        const data = request.payload;
        await pois.update({ description: data.description });
        response.redirect('/report/'.concat(region_id));
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  delete: {
    handler: async function(request, h) {
      try {
        const region_id = request.params.region_id;
        const pois_id   = request.params.pois_id;
        const pois = await Pois.findById( pois_id );
        await pois.delete();
        response.redirect('/report/'.concat(region_id));
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  add: {
    handler: async function(request, h) {
      try {
        const region_id = request.params.region_id;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;

        const newPois = new Pois({
          coordinates: {
             irishGrid: {},
             fullIrishGrid: {},
             tmcGrid: {},
             geo: { lat: data.latitude, long: data.longitude }
          },
          name: "**".concat(data.name).concat("**"),
          nameHtml: "&lt;p&gt;&lt;strong&gt;".concat(data.name).concat("&lt;/strong&gt;&lt;/p&gt;\n"),
          safeName: data.name.replace(' ', '-'),
          cursor: 0,
          description: data.description,
          costalZone: region_id
        });
        await newPois.save();
        return h.redirect('/poi/report');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Pois;