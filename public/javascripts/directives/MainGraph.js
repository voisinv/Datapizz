/**
 * Created by Mac-Vincent on 06/07/15.
 */

function mainGraph($window, Entities) {

    return {
        restrict: 'E',
        templateUrl: 'partials/main',
        scope: {
            collection: '='
        },
        controller: function ($timeout, $mdSidenav, $mdUtil, $log) {
            var self = this;
            self.toggleRight = buildToggler('right');
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildToggler(navID) {
                var debounceFn = $mdUtil.debounce(function () {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
                return debounceFn;
            }

            self.close = function () {
                $mdSidenav('right').close()
                    .then(function () {
                        $log.debug("close RIGHT is done");
                    });
            };
            self.itemSelected = '';
            self.datas = [];
        },
        controllerAs: 'ctrl',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.entities = Entities.get();
            init();
            function updateListItem() {
                ctrl.datas = ctrl.entities.articles.filter(function (e) {
                    return e.tags.some(function (tag) {
                        return tag === ctrl.itemSelected;
                    });
                }).sort(function (a, b) {
                    return a.length - b.length;
                });
            }

            color = d3.scale.category10();

            var w, h, svg, force, maxradiuscircle, maxradiusline;

            var x, y;

            scope.$on('datesChanged', function () {
                console.log('datesChanged');
                update();
            });

            function init() {
                x = d3.scale.linear()
                    .domain([0, $window.innerWidth * 0.8])
                    .range([0, $window.innerWidth * 0.8]);

                y = d3.scale.linear()
                    .domain([0, $window.innerHeight])
                    .range([$window.innerHeight, 0]);

                w = $window.innerWidth * 0.8;
                h = $window.innerHeight * 0.94;
                svg = d3.select('#graph').append("svg")
                    .attr("width", w)
                    .attr("height", h - 64)
                    .append('g');
                //.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));

                force = d3.layout.force()
                    .nodes(ctrl.entities.tags)
                    .links(ctrl.entities.links);

                maxradiuscircle = _.max(ctrl.entities.tags, function (d) {
                    return d.radius;
                }).radius;

                maxradiusline = _.max(ctrl.entities.links, function (d) {
                    return d.value;
                }).value;

                update();
                force.charge(170)
                    .linkDistance(60)
                    .size([w, h])
                    .gravity(.2)
                    .charge(function (d) {
                        return -1 * 170 * d.radius;
                    })
                    /*
                     .gravity(.01)
                     .charge(-80000)
                     .friction(0)
                     .linkDistance(function (d) {
                     return d.value * 10
                     })
                     .size([w, h])*/
                    .start()
            }

            var node, circle;

            function zoom() {
                node.attr("transform", transform);
            }

            function transform(d) {
                console.log(d[0]);
                return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
            }

            var zoomListener = d3.behavior.zoom()
                .scaleExtent([0.1, 3])
                .on("zoom", zoomHandler);

            // function for handling zoom event
            function zoomHandler() {
                node.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                svg.selectAll('.link').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            zoomListener(d3.select('#graph svg'));
            function update() {

                var link = svg
                    .selectAll(".link")
                    .data(ctrl.entities.links);

                link
                    .enter()
                    .append("line")
                    .attr("class", "link")

                    .attr('opacity', function (d) {
                        return d.value / maxradiusline;
                    })
                    .style("stroke-width", function (d) {
                        return d.value * 0.8;
                    });

                link.transition().duration(3000)
                    .style("stroke-width", function (d) {
                        return d.value / 2;
                    });
                link.exit().remove();

                node = svg.selectAll(".node")
                    .data(ctrl.entities.tags);

                node.enter()
                    .append('g')
                    .attr('fill', 'black')
                    .call(force.drag);

                node.append('circle')
                    .attr('class', 'node')
                    .attr("r", function (d) {
                        return (d.radius - 1);//0.4;
                    })
                    .attr("id", function (d) {
                        return 'circle-' + d.value;
                    })
                    .attr('opacity', function (d) {
                        return d.radius / maxradiuscircle;
                    })
                    .style("fill", function () {
                        return '#3498db'
                    })
                    .on('click', function (e) {
                        ctrl.itemSelected = e.value;
                        updateListItem();
                        ctrl.toggleRight();
                    })

                    .on('mouseup', function (e) {

                        /*
                         scope.main.articleSelected = e;
                         $mdSidenav('right').open()
                         .then(function(i){
                         console.log('i', e)
                         i.node = e;
                         });
                         */

                    });

                node.append("text")
                    .attr("dx", function (d) {
                        return d.radius - 1
                    })
                    .attr("dy", ".35em")
                    .attr('opacity', function (d) {
                        return (d.radius / maxradiuscircle).toFixed(2) * 4;
                    })
                    .text(function (d) {
                        return d.value
                    });
                //.style("stroke", "gray");

                /*
                 var circle = node.enter()
                 .append("circle")
                 .attr('class', 'circle')
                 .attr("r", function (d) {
                 return d.radius - 1;
                 })
                 .attr("id", function (d) {
                 return 'circle-' + d.value;
                 })
                 .style("fill", function (d, i) {
                 return '#3498db'
                 })
                 .on('mouseover', function (d, i) {
                 d3.selectAll("circle").attr('opacity', 0.3);
                 d3.select(this).attr('opacity', 1);
                 mouseover = true;
                 main.hoverTag(d);
                 })
                 .on('mouseleave', function () {
                 d3.selectAll("circle").attr('opacity', 1);
                 })

                 .call(force.drag);
                 */
                node.transition().duration(1000)
                    .attr('r', function (d) {
                        return (d.radius - 1) * 0.4;
                    });

                force.on("tick", function () {
                    link.attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });

                    d3.selectAll("circle")
                        .attr("cx", function (d) {
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            return d.y;
                        });
                    d3.selectAll("text")
                        .attr("x", function (d) {
                            return d.x + d.radius / 2;
                        })
                        .attr("y", function (d) {
                            return d.y;
                        });
                });
                force.charge(170)
                    .linkDistance(60)
                    .size([w, h])
                    .gravity(.2)
                    .charge(function (d) {
                        return -1 * 170 * d.radius;
                    })

                    /*
                     .gravity(.01)
                     .charge(-80000)
                     .friction(0)
                     .linkDistance(function (d) {
                     return d.value * 10
                     })
                     .size([w, h])*/
                    .start()


            }
        }
    };

    function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2
                || x2 < nx1
                || y1 > ny2
                || y2 < ny1;
        };
    }
}

angular.module('datapizz.directives')
    .directive('mainGraph', mainGraph);
