const helloWorld = () => {
    console.log("Hello World");
}
export const config = {
    '/': {
        allowedMethods: ['GET'],
        GET: {
            allowedRoles: ['globalManager', 'manager', 'regular'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}
                    },
                    permissions: {
                        hello: helloWorld
                    }
                },
                manager: {
                    filter: {
                        where: {}
                    },
                    permissions: {
                        hello: helloWorld
                    }
                }
            }
        }
    },
    '/group': {
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        GET: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        POST: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        PUT: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        DELETE: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}
                    },
                    permissions: {}
                }
            }
        }
    },
    '/role': {
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        GET: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        POST: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        PUT: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}

                    },
                    permissions: {}
                }
            }
        },
        DELETE: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    filter: {
                        where: {}
                    },
                    permissions: {}
                }
            }
        }
    }
}

export const apiBasePath = ['/','/role','/group']