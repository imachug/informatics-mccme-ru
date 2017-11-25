import React from 'react';
import { connect } from 'react-redux';

import * as problemActions from '../actions/problemActions';

import ProblemRuns from './ProblemRuns';
import ProblemSubmitForm from './ProblemSubmitForm';


@connect((state) => {
    return {
        problems: state.problems,
    }
})
export default class Problem extends React.Component {
    constructor(props) {
        super(props);
        this.fetchProblemData(props.problemId);
    }

    fetchProblemData(problemId) {
        this.props.dispatch(problemActions.fetchProblem(problemId));
        this.props.dispatch(problemActions.fetchProblemRuns(problemId));
    }

    componentWillReceiveProps(nextProps) {
        const { problemId } = this.props;
        const nextProblemId = nextProps.problemId;
        if (problemId !== nextProblemId) {
            this.fetchProblemData(nextProps.problemId);
        }
    }

    renderLimits() {
        const { problemId } = this.props;
        const {data} = this.props.problems[problemId];

        if (!data.show_limits)
            return;

        const { memorylimit, timelimit } = data;

        return <div>
            <div>Ограничение по времени, сек: {timelimit}</div>
            <div>Ограничение по памяти, Мб: {memorylimit / 1024 / 1024}</div>
        </div>;
    }

    render() {
        const { problemId } = this.props;
        const problem = this.props.problems[problemId];

        if (!problem || (!problem.fetched && problem.fetching)) {
            return <div>
                fetching problem...
            </div>
        }

        const {fetched, data, runs} = problem;

        if (!fetched) {
            return <div>
                some error occured...
            </div>
        }
        return <div class="problem">
            <ProblemSubmitForm problem={problem}/>
            <ProblemRuns problemId={problemId}/>
            <h1 class="problem-title">Задача {data.id}: {data.name}</h1>
            {this.renderLimits()}
            <div dangerouslySetInnerHTML={{__html: data.content}} />
            <div dangerouslySetInnerHTML={{__html: data.sample_tests_html}}/>
        </div>
    }
}
