window.onload = function() {
  let getJSON = function (url) {
    return $.ajax({
      url: url,
      dataType: 'json',
      async: false
    });
  };

  let linesChart = function(files) {
    let regex = /\d{4}\-\d{2}\-\d{2}/;
    f0 = files[0].map(function(x) {
      return [parseInt(x.d), x.value, x.cat.toUpperCase()]
    });

    f1 = files[1].map(function (x) {
      return [Date.parse(x.myDate), x.val, x.categ.toUpperCase()]
    });

    f2 = files[2].map(function (x) {
      return [
        Date.parse(x.raw.match(regex)[0]),
        x.val,
        x.raw.substring(x.raw.indexOf("#") + 1,
        x.raw.indexOf("#", x.raw.indexOf("#") + 1)).toUpperCase()
      ]
    });

    let data = f0.concat(f1, f2)

    let cats = _.groupBy(data, function(i) {
      return i[2]
    });
    let series = _.map(cats, function(value, prop) {
      return {
        name: prop,
        data: _.sortBy(_.map(value, i => [i[0], i[1]]), 0)
      }
    })

    for (let cat = 0; cat < series.length; cat++) {
      for (let i = 0; i < series[cat].data.length - 1; i++) {
        if (series[cat].data[i][0] == series[cat].data[i + 1][0]) {
          series[cat].data[i][1] += series[cat].data[i + 1][1];
          series[cat].data.splice(i + 1, 1);
        }
      }
    }

    Highcharts.chart('lines', {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Values in time',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
        },
        dateTimeLabelFormats: {
          month: '%e. %b',
          year: '%b',
        },
      },
      series: series,
    });
  }

  let pieChart = function(files) {
    f0 = files[0].map(function (x) {
      return [x.cat, x.value]
    });

    f1 = files[1].map(function (x) {
      return [x.categ, x.val]
    });

    f2 = files[2].map(function (x) {
      return [
        x.raw.substring(x.raw.indexOf("#") + 1,
          x.raw.indexOf("#", x.raw.indexOf("#") + 1)),
        x.val]
    });

    let cats = f0.concat(f1, f2)

    let catsum = _.reduce(cats, function(result, value, index, coll) {
      cat = value[0].toUpperCase();
      if (cat in result) {
        result[cat] += value[1];
      } else {
        result[cat] = value[1];
      }
      return result;

    }, {});
    let data = _.map(catsum, function(value, prop) {
      return {
        name: prop,
        y: value
      }
    })

    Highcharts.chart('pie', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Aggregated by Categories'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Categories',
        data: data
      }]
    });
  }

  Promise.all([
    getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data1.json").responseJSON,
    getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data2.json").responseJSON,
    getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data3.json").responseJSON
  ]).then(function(files) {
    pieChart(files);
    linesChart(files);
  })
};
