(function () {
  'use strict';

  function markShortTables() {
    // Handle native <table> elements
    document.querySelectorAll('.page-content table').forEach(function (table) {
      var tbody = table.querySelector('tbody');
      if (!tbody) return;

      var rows = tbody.querySelectorAll('tr');
      if (rows.length === 2) {
        table.classList.add('table--short');
      }
    });

    // Handle div-based .td-table tables
    document.querySelectorAll('.page-content .td-table').forEach(function (table) {
      var rows = table.querySelectorAll('.tr');
      if (rows.length === 2) {
        table.classList.add('table--short');
        rows.forEach(function (row) {
          row.classList.remove('alt');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markShortTables);
  } else {
    markShortTables();
  }
})();
