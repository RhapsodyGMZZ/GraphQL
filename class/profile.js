import { formatXPSize } from "../index.js";
import { Domain } from "../internal/requestHandler.js";

export class Profile {
    constructor(level, activity, ratioObj, xp, xpGraph) {
        this.container = document.getElementById('container');
        this.level = level;
        this.activities = activity;
        this.ratioObj = ratioObj;
        this.xp = xp;
        this.xpGraph = xpGraph;
        this.percentage;
        this.nbsp = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        if (this.ratioObj.done > this.ratioObj.received) {
            this.percentage = this.ratioObj.received / this.ratioObj.done;
        } else {
            this.percentage = this.ratioObj.done / this.ratioObj.received;
        }
        this.xpBlock();
        this.ratioBlock();
        this.graphBlock();
    }

    xpBlock() {
        // let background = document.createElement('div');
        // background.id  = 'background';
        let card = document.createElement('div');
        card.id = 'card-xp';
        card.style.display = 'none';
        let xp = document.createElement('div');
        xp.id = 'xp';
        xp.textContent = this.xp.slice(0, -2);
        let metric = document.createElement('div');
        metric.id = 'xp-metric';
        metric.innerHTML = `&nbsp;${this.xp.slice(-3)}`
        xp.appendChild(metric);
        card.appendChild(xp);
        let sub = document.createElement('sub');
        sub.textContent = 'Last activity :'
        card.appendChild(sub);
        card.appendChild(document.createElement('hr'));
        let lastActivity = document.createElement('div');
        lastActivity.id = 'activities';
        this.activities.forEach((activity) => {
            let act = document.createElement('a');
            act.href = `${Domain}/intra${activity.path}`
            act.classList.add('activity');
            act.target = '_blank'
            act.textContent = `${activity.path.split('/')[3]} -- ${formatXPSize(activity.amount)}`;
            lastActivity.appendChild(act);
        });
        card.appendChild(lastActivity);
        // background.appendChild(card);
        this.container.appendChild(card);
        // this.container.appendChild(background);
    }

    modal() {

    }

    ratioBlock() {
        let card = document.createElement('div');
        card.id = 'card-ratio';
        let ratio = document.createElement('div');
        ratio.id = 'ratio';
        if (this.ratioObj.ratio >= 2) {
            ratio.innerHTML = `${this.ratioObj.ratio} ${this.nbsp} Best ratio ever !`;
            ratio.style.color = '#57FF81';
        } else if (this.ratioObj.ratio < 2 && this.ratioObj.ratio >= 1.25) {
            ratio.innerHTML = `${this.ratioObj.ratio} ${this.nbsp} Almost perfect !`;
            ratio.style.color = '#7BE9FF';
        } else if (this.ratioObj.ratio < 1.25 && this.ratioObj.ratio >= 1) {
            ratio.innerHTML = `${this.ratioObj.ratio}  ${this.nbsp} You can do better !`;
            ratio.style.color = '#FCE219';
        } else if (this.ratioObj.ratio < 1 && this.ratioObj.ratio >= 0.8) {
            ratio.innerHTML = `${this.ratioObj.ratio} ${this.nbsp} Make more audits !`;
            ratio.style.color = '#FC8519';
        } else if (this.ratioObj.ratio < 0.8) {
            ratio.innerHTML = `${this.ratioObj.ratio} ${this.nbsp} Careful buddy !`;
            ratio.style.color = '#8C281F';
        }
        card.appendChild(ratio);
        let graph = document.createElement('div');
        graph.id = 'ratio-graph';
        graph.appendChild(this.drawRatioGraph());
        card.appendChild(graph);
        this.container.appendChild(card);
    }

    drawRatioGraph() {
        let graph = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        graph.setAttribute('width', '100%')
        let barDone = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        barDone.setAttribute('stroke', '#D94A4A');
        barDone.setAttribute('stroke-width', 6)
        barDone.setAttribute('x1', 0);
        if (this.ratioObj.done > this.ratioObj.received) barDone.setAttribute('x2', 0.8 * 500);
        else barDone.setAttribute('x2', 0.8 * this.percentage * 500)
        barDone.setAttribute('y1', 11);
        barDone.setAttribute('y2', 11);
        graph.appendChild(barDone);

        let txtDone = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txtDone.textContent = `${formatXPSize(this.ratioObj.done)} done`;
        txtDone.classList.add('svg-text');
        txtDone.setAttribute('x', Number(barDone.getAttribute('x2')) + 10);
        txtDone.setAttribute('y', 15);
        txtDone.setAttribute('fill', '#8C8C87');
        graph.appendChild(txtDone);

        let barReceived = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        barReceived.setAttribute('stroke', '#8C281F');
        barReceived.setAttribute('stroke-width', 6);
        barReceived.setAttribute('x1', 0);
        if (this.ratioObj.received > this.ratioObj.done) barReceived.setAttribute('x2', 0.8 * 500);
        else barReceived.setAttribute('x2', 0.8 * this.percentage * 500)
        barReceived.setAttribute('y1', 100);
        barReceived.setAttribute('y2', 100);
        graph.appendChild(barReceived);

        let txtReceived = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txtReceived.textContent = `${formatXPSize(this.ratioObj.received)} received`;
        txtReceived.classList.add('svg-text');
        txtReceived.setAttribute('x', Number(barReceived.getAttribute('x2')) + 10);
        txtReceived.setAttribute('y', 104);
        txtReceived.setAttribute('fill', '#8C8C87');
        graph.appendChild(txtReceived);

        return graph;
    }

    graphBlock() {
        let card = document.createElement('div');
        card.id = 'card-xpGraph';
        let title = document.createElement('div');
        title.id = 'title-xpGraph';
        title.textContent = `XP`
        let sub = document.createElement('div');
        sub.id = 'subGraph';
        sub.innerHTML = '&nbsp;progression';
        title.appendChild(sub);
        card.appendChild(title);
        card.appendChild(document.createElement('hr'));
        let graph = document.createElement('div');
        graph.id = 'xpGraph'
        graph.appendChild(this.drawGraphXP());
        card.appendChild(graph);
        this.container.appendChild(card)
    }

    drawGraphXP() {
        this.xpGraph = this.xpGraph.map((element) => {
            let newdata = {}
            newdata.y = element.amount;
            newdata.projectName = element.path.split("/div-01/")[1];
            newdata.x = new Date(element.createdAt).toLocaleDateString("fr");
            return newdata;
        }).reverse();
        let contentPoint = this.xpGraph.map((element) => {
            let tab = [];
            tab.push(element.projectName)
            tab.push(element.x)
            tab.push(`${formatXPSize(element.y)}`)
            return tab;
        });

        return new GraphXp(this.xpGraph, true, contentPoint).SVG;
    }

}

class Svg {
    constructor(width, height, id) {
        this.width = width;
        this.height = height;
        this.id = id;
        this.SVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        this.SVG.setAttribute("width", width);
        this.SVG.setAttribute("height", height);
        this.SVG.setAttribute("id", id);
    }
}


class GraphPath extends Svg {
    constructor(width, height, id, data, graphWidth, graphHeight, isPoint, tabPointContent) {
        super(width, height, id);
        this.ymax = data.reduce((acc, element) => acc += element.y, 0);
        let echelleX = graphWidth / (data.length + 1);
        let echelleY = graphHeight / this.ymax;
        this.marginHeigth = (height - graphHeight) / 2;
        this.marginWidth = (width - graphWidth) / 2;
        let y = 0;
        let x = -1;
        this.chemin = `M0 ${(graphHeight + this.marginHeigth) - y * echelleY}`;
        data.forEach((element) => {
            x++;
            let X = x * echelleX + this.marginWidth;
            let Y = (graphHeight + this.marginHeigth) - y * echelleY;
            y += element.y
            this.chemin += ` L${X} ${Y}`;
            if (isPoint) {
                let circle = new CircleAnimation(this.SVG, X, Y, 4, '#D94A4A', '#8C281F', '#8C281F', 1, tabPointContent[x]);
                this.SVG.appendChild(circle.circle);
            }
        })
        this.courbe = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        this.courbe.setAttribute('d', this.chemin);
        this.courbe.setAttribute('fill', 'none');
        this.courbe.setAttribute('stroke', '#D94A4A');
        this.courbe.setAttribute('stroke-width', '2');
        this.SVG.appendChild(this.courbe);
    }
}

export class GraphXp extends GraphPath {
    constructor(data, isPoint, tabPointContent) {
        super(900, 500, "graphxp", data, 700, 300, isPoint, tabPointContent);
    }
}


class Circle {
    constructor(cx, cy, r, fillcolor, strokeColor, strokeWidth) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.fillcolor = fillcolor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.circle.setAttribute('cx', this.cx);
        this.circle.setAttribute('cy', this.cy);
        this.circle.setAttribute('r', this.r);
        this.circle.setAttribute('fill', this.fillcolor);
        this.circle.setAttribute('stroke', this.strokeColor);
        this.circle.setAttribute('stroke-width', this.strokeWidth);
    }
}

class CircleAnimation extends Circle {
    constructor(parents, cx, cy, r, fillColorOut, fillColorOver, strokeColor, strokeWidth, content) {
        super(cx, cy, r, fillColorOut, strokeColor, strokeWidth);
        this.parents = parents;
        this.fillColorOut = fillColorOut;
        this.fillColorOver = fillColorOver;
        this.circle.setAttribute('data-projet', content.join('$'));
        this.circle.addEventListener('mouseover', () => {
            const texteProjet = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            texteProjet.setAttribute('x', parseInt(this.cx) - 40);
            texteProjet.setAttribute('y', parseInt(this.cy) + 30);
            texteProjet.setAttribute('fill', '#8C8C87');
            this.circle.getAttribute('data-projet').split("$").forEach((line, index) => {
                const tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                tspan.setAttribute('x', parseFloat(this.circle.getAttribute('cx')));
                tspan.setAttribute('dy', index > 0 ? '1.2em' : 0); // Espacement vertical entre chaque ligne
                tspan.textContent = line;
                texteProjet.appendChild(tspan);
            });
            this.parents.appendChild(texteProjet);
            this.circle.setAttribute('fill', this.fillColorOver);
        });
        this.circle.addEventListener('mouseout', () => {
            this.parents.removeChild(this.parents.lastChild);
            this.circle.setAttribute('fill', this.fillColorOut);
        })
    }
}