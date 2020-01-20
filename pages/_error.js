import React from 'react';
import PropTypes from 'prop-types';


const styles = (theme) => ({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    svg: {
        width: '100%',
        height: 300
    },
    textLine: {
        fill: 'none',
        strokeDasharray: 300,
        animation: 'dash 300s linear alternate infinite',
        stroke: theme.palette.primary.main,
        strokeWidth: 5,
        fontSize: 300
    },
    '@keyframes dash': {
        to: {
            strokeDashoffset: 50000
        }
    }
});

const classes = {};

const ErrorPage = ({ statusCode, statusMessage }) => (
    <div className={classes.container}>
        <svg className={classes.svg}>
            <text
                x='50%'
                y='50%'
                alignmentBaseline='middle'
                dominantBaseline='middle'
                textAnchor='middle'
                preserveAspectRatio='xMinYMin'
                className={classes.textLine}
            >
                {statusCode}
            </text>
        </svg>
        {(statusMessage) && (
            <h3>
                {statusMessage}
            </h3>
        )}
    </div>
);

ErrorPage.getInitialProps = ({ res, err }) => {
    // eslint-disable-next-line no-nested-ternary
    const statusCode = res ? res.statusCode : (err ? err.statusCode : 404);

    return {
        statusCode
    };
};

ErrorPage.propTypes = {
    statusCode: PropTypes.number,
    statusMessage: PropTypes.string
};

ErrorPage.defaultProps = {
    statusCode: 404,
    statusMessage: 'Page Not Found :('
};

export default ErrorPage;
