var _Math = {

    sqrt   : Math.sqrt,
    abs    : Math.abs,
    floor  : Math.floor,
    cos    : Math.cos,
    sin    : Math.sin,
    acos   : Math.acos,
    asin   : Math.asin,
    atan2  : Math.atan2,
    round  : Math.round,
    pow    : Math.pow,
    max    : Math.max,
    min    : Math.min,
    random : Math.random,

    degtorad : 0.0174532925199432957,
    radtodeg : 57.295779513082320876,
    PI       : 3.141592653589793,
    TwoPI    : 6.283185307179586,
    PI90     : 1.570796326794896,
    PI270    : 4.712388980384689,

    INF      : Infinity,
    EPZ      : 0.00001,
    EPZ2      : 0.000001,

    lerp: function ( x, y, t ) { 

        return ( 1 - t ) * x + t * y; 

    },

    randInt: function ( low, high ) { 

        return low + _Math.floor( _Math.random() * ( high - low + 1 ) ); 

    },

    rand: function ( low, high ) { 

        return low + _Math.random() * ( high - low ); 

    },
    
    generateUUID: function () {

        // http://www.broofa.com/Tools/Math.uuid.htm

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
        var uuid = new Array( 36 );
        var rnd = 0, r;

        return function generateUUID() {

            for ( var i = 0; i < 36; i ++ ) {

                if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                    uuid[ i ] = '-';

                } else if ( i === 14 ) {

                    uuid[ i ] = '4';

                } else {

                    if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

                }

            }

            return uuid.join( '' );

        };

    }(),

    int: function( x ) { 

        return _Math.floor(x); 

    },

    fix: function( x, n ) { 

        return x.toFixed(n || 3, 10); 

    },

    clamp: function ( value, min, max ) { 

        return _Math.max( min, _Math.min( max, value ) ); 

    },
    
    //clamp: function ( x, a, b ) { return ( x < a ) ? a : ( ( x > b ) ? b : x ); },

    

    distance: function( p1, p2 ){

        var xd = p2[0]-p1[0];
        var yd = p2[1]-p1[1];
        var zd = p2[2]-p1[2];
        return _Math.sqrt(xd*xd + yd*yd + zd*zd);

    },

    /*unwrapDegrees: function ( r ) {

        r = r % 360;
        if (r > 180) r -= 360;
        if (r < -180) r += 360;
        return r;

    },

    unwrapRadian: function( r ){

        r = r % _Math.TwoPI;
        if (r > _Math.PI) r -= _Math.TwoPI;
        if (r < -_Math.PI) r += _Math.TwoPI;
        return r;

    },*/

    acosClamp: function ( cos ) {

        if(cos>1)return 0;
        else if(cos<-1)return _Math.PI;
        else return _Math.acos(cos);

    },

    distanceVector: function( v1, v2 ){

        var xd = v1.x - v2.x;
        var yd = v1.y - v2.y;
        var zd = v1.z - v2.z;
        return xd * xd + yd * yd + zd * zd;

    },

    dotVectors: function ( a, b ) {

        return a.x * b.x + a.y * b.y + a.z * b.z;

    },

}

function Vec3 ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
}

Object.assign( Vec3.prototype, {

    Vec3: true,

    set: function( x, y, z ){

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    },

    add: function ( a, b ) {

        if ( b !== undefined ) return this.addVectors( a, b );

        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;

    },

    addEqual: function ( v ) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;

    },

    sub: function ( a, b ) {

        if ( b !== undefined ) return this.subVectors( a, b );

        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;

    },

    subEqual: function ( v ) {

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;

    },

    scale: function ( v, s ) {

        this.x = v.x * s;
        this.y = v.y * s;
        this.z = v.z * s;
        return this;

    },

    scaleEqual: function( s ){

        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;

    },

    multiply: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },

    multiplyScalar: function( s ){

        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;

    },

    /*scaleV: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },

    scaleVectorEqual: function( v ){

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;

    },*/

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;

        return this;

    },

    subScaledVector: function ( v, s ) {

        this.x -= v.x * s;
        this.y -= v.y * s;
        this.z -= v.z * s;

        return this;

    },

    /*addTime: function ( v, t ) {

        this.x += v.x * t;
        this.y += v.y * t;
        this.z += v.z * t;
        return this;

    },
    
    addScale: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;

    },

    subScale: function ( v, s ) {

        this.x -= v.x * s;
        this.y -= v.y * s;
        this.z -= v.z * s;
        return this;

    },*/
   
    cross: function( a, b ) {

        if ( b !== undefined ) return this.crossVectors( a, b );

        var x = this.x, y = this.y, z = this.z;

        this.x = y * a.z - z * a.y;
        this.y = z * a.x - x * a.z;
        this.z = x * a.y - y * a.x;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    tangent: function ( a ) {

        var ax = a.x, ay = a.y, az = a.z;

        this.x = ay * ax - az * az;
        this.y = - az * ay - ax * ax;
        this.z = ax * az + ay * ay;

        return this;

    },

    

    

    invert: function ( v ) {

        this.x=-v.x;
        this.y=-v.y;
        this.z=-v.z;
        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    addition: function () {

        return this.x + this.y + this.z;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

        return _Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },

    copy: function( v ){

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;

    },

    /*mul: function( b, a, m ){

        return this.mulMat( m, a ).add( b );

    },

    mulMat: function( m, a ){

        var e = m.elements;
        var x = a.x, y = a.y, z = a.z;

        this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z;
        this.y = e[ 3 ] * x + e[ 4 ] * y + e[ 5 ] * z;
        this.z = e[ 6 ] * x + e[ 7 ] * y + e[ 8 ] * z;
        return this;

    },*/

    applyMatrix3: function ( m, transpose ) {

        //if( transpose ) m = m.clone().transpose();
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;

        if( transpose ){
            
            this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z;
            this.y = e[ 3 ] * x + e[ 4 ] * y + e[ 5 ] * z;
            this.z = e[ 6 ] * x + e[ 7 ] * y + e[ 8 ] * z;

        } else {
      
            this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
            this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
            this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;
        }

        return this;

    },

    applyQuaternion: function ( q ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix =  qw * x + qy * z - qz * y;
        var iy =  qw * y + qz * x - qx * z;
        var iz =  qw * z + qx * y - qy * x;
        var iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    },

    testZero: function () {

        if(this.x!==0 || this.y!==0 || this.z!==0) return true;
        else return false;

    },

    testDiff: function( v ){

        return this.equals( v ) ? false : true;

    },

    equals: function ( v ) {

        return v.x === this.x && v.y === this.y && v.z === this.z;

    },

    clone: function () {

        return new this.constructor( this.x, this.y, this.z );

    },

    toString: function(){

        return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
        
    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    toArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;

    },

    fromArray: function( array, offset ){

        if ( offset === undefined ) offset = 0;
        
        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];
        return this;

    },


} );


function Quat ( x, y, z, w ){

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

}

Object.assign( Quat.prototype, {

    Quat: true,

    set: function ( x, y, z, w ) {

        
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    },

    addTime: function( v, t ){

        var ax = v.x, ay = v.y, az = v.z;
        var qw = this.w, qx = this.x, qy = this.y, qz = this.z;
        t *= 0.5;    
        this.x += t * (  ax*qw + ay*qz - az*qy );
        this.y += t * (  ay*qw + az*qx - ax*qz );
        this.z += t * (  az*qw + ax*qy - ay*qx );
        this.w += t * ( -ax*qx - ay*qy - az*qz );
        this.normalize();
        return this;

    },

    /*mul: function( q1, q2 ){

        var ax = q1.x, ay = q1.y, az = q1.z, as = q1.w,
        bx = q2.x, by = q2.y, bz = q2.z, bs = q2.w;
        this.x = ax * bs + as * bx + ay * bz - az * by;
        this.y = ay * bs + as * by + az * bx - ax * bz;
        this.z = az * bs + as * bz + ax * by - ay * bx;
        this.w = as * bs - ax * bx - ay * by - az * bz;
        return this;

    },*/

    multiply: function ( q, p ) {

        if ( p !== undefined ) return this.multiplyQuaternions( q, p );
        return this.multiplyQuaternions( this, q );

    },

    multiplyQuaternions: function ( a, b ) {

        var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;

    },

    setFromUnitVectors: function( v1, v2 ) {

        var vx = new Vec3();
        var r = v1.dot( v2 ) + 1;

        if ( r < _Math.EPS2 ) {

            r = 0;
            if ( _Math.abs( v1.x ) > _Math.abs( v1.z ) ) vx.set( - v1.y, v1.x, 0 );
            else vx.set( 0, - v1.z, v1.y );

        } else {

            vx.crossVectors( v1, v2 );

        }

        this._x = vx.x;
        this._y = vx.y;
        this._z = vx.z;
        this._w = r;

        return this.normalize();

    },

    arc: function( v1, v2 ){

        var x1 = v1.x;
        var y1 = v1.y;
        var z1 = v1.z;
        var x2 = v2.x;
        var y2 = v2.y;
        var z2 = v2.z;
        var d = x1*x2 + y1*y2 + z1*z2;
        if( d==-1 ){
            x2 = y1*x1 - z1*z1;
            y2 = -z1*y1 - x1*x1;
            z2 = x1*z1 + y1*y1;
            d = 1 / _Math.sqrt( x2*x2 + y2*y2 + z2*z2 );
            this.w = 0;
            this.x = x2*d;
            this.y = y2*d;
            this.z = z2*d;
            return this;
        }
        var cx = y1*z2 - z1*y2;
        var cy = z1*x2 - x1*z2;
        var cz = x1*y2 - y1*x2;
        this.w = _Math.sqrt( ( 1 + d) * 0.5 );
        d = 0.5 / this.w;
        this.x = cx * d;
        this.y = cy * d;
        this.z = cz * d;
        return this;

    },

    normalize: function(){

        var l = this.length();
        if ( l === 0 ) {
            this.set( 0, 0, 0, 1 );
        } else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }
        return this;

    },

    inverse: function () {

        return this.conjugate().normalize();

    },

    invert: function ( q ) {

        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        this.conjugate().normalize();
        return this;

    },

    conjugate: function () {

        this.x *= - 1;
        this.y *= - 1;
        this.z *= - 1;
        return this;

    },

    length: function(){

        return _Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w  );

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

    },
    
    copy: function( q ){
        
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;

    },

    clone: function( q ){

        return new Quat( this.x, this.y, this.z, this.w );

    },

    testDiff: function ( q ) {

        return this.equals( q ) ? false : true;

    },

    equals: function ( q ) {

        return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;

    },

    toString: function(){

        return"Quat["+this.x.toFixed(4)+", ("+this.y.toFixed(4)+", "+this.z.toFixed(4)+", "+this.w.toFixed(4)+")]";
        
    },

    setFromEuler: function ( x, y, z ){

        var c1 = Math.cos( x * 0.5 );
        var c2 = Math.cos( y * 0.5 );
        var c3 = Math.cos( z * 0.5 );
        var s1 = Math.sin( x * 0.5 );
        var s2 = Math.sin( y * 0.5 );
        var s3 = Math.sin( z * 0.5 );

        // XYZ
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;

        return this;

    },
    
    setFromAxis: function ( axis, rad ) {

        axis.normalize();
        rad = rad * 0.5;
        var s = _Math.sin( rad );
        this.x = s * axis.x;
        this.y = s * axis.y;
        this.z = s * axis.z;
        this.w = _Math.cos( rad );
        return this;

    },

    setFromMat33: function ( m ) {

        var trace = m[0] + m[4] + m[8];
        var s;

        if ( trace > 0 ) {

            s = _Math.sqrt( trace + 1.0 );
            this.w = 0.5 / s;
            s = 0.5 / s;
            this.x = ( m[5] - m[7] ) * s;
            this.y = ( m[6] - m[2] ) * s;
            this.z = ( m[1] - m[3] ) * s;

        } else {

            var out = [];
            var i = 0;
            if ( m[4] > m[0] ) i = 1;
            if ( m[8] > m[i*3+i] ) i = 2;

            var j = (i+1)%3;
            var k = (i+2)%3;
            
            s = _Math.sqrt( m[i*3+i] - m[j*3+j] - m[k*3+k] + 1.0 );
            out[i] = 0.5 * fRoot;
            s = 0.5 / fRoot;
            this.w = ( m[j*3+k] - m[k*3+j] ) * s;
            out[j] = ( m[j*3+i] + m[i*3+j] ) * s;
            out[k] = ( m[k*3+i] + m[i*3+k] ) * s;

            this.x = out[1];
            this.y = out[2];
            this.z = out[3];

        }

        return this;

    },

    toArray: function ( array, offset ) {

        offset = offset || 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;
        array[ offset + 3 ] = this.w;

    },

    fromArray: function( array, offset ){

        offset = offset || 0;
        this.set( array[ offset ], array[ offset + 1 ], array[ offset + 2 ], array[ offset + 3 ] );
        return this;

    }

});

export { Quat, _Math };