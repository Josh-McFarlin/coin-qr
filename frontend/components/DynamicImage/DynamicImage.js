import React from 'react';
import PropTypes from 'prop-types';


const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    png: 'image/png',
    svg: 'image/svg+xml'
};

class DynamicImage extends React.PureComponent {
    render() {
        const { info, ...rest } = this.props;

        return (
            <picture>
                {info.types.map((type) => (
                    <source
                        srcSet={`${info.imgSrc}.${type}`}
                        type={mimeTypes[type]}
                        key={type}
                    />
                ))}
                <img
                    src={`${info.imgSrc}.${info.defaultType}`}
                    alt=''
                    {...rest}
                />
            </picture>
        );
    }
}

DynamicImage.propTypes = {
    info: PropTypes.shape({
        imgSrc: PropTypes.string,
        types: PropTypes.arrayOf(PropTypes.string),
        defaultType: PropTypes.string
    }).isRequired
};

export default DynamicImage;
