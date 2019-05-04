import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';


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

class NotFoundPage extends React.PureComponent {
    render() {
        const { classes, statusCode, statusMessage } = this.props;

        return (
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
    }
}

NotFoundPage.propTypes = {
    classes: PropTypes.object.isRequired,
    statusCode: PropTypes.number,
    statusMessage: PropTypes.string
};

NotFoundPage.defaultProps = {
    statusCode: 404,
    statusMessage: 'Page Not Found :('
};

export default withStyles(styles)(NotFoundPage);
