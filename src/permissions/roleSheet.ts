import { request } from "http";
import { GroupService } from "../services/groupService";

const helloWorld = () => {
    console.log("Hello World");
    return {};
}

const userAdmin = (dummy = 1, dummy1 = 1) => {
    console.log("Admin Access");
    return {
        directStatement: ` `,
        table: "user",
        queryStatement: "1=1",
        queryCondition: {}
    }
}
const userGroupAdminAccess = async (body, user) => {
    console.log("Body----->", body);
    console.log("User----->", user);
    let groupService = new GroupService();
    let group = [];
    if (body.roleids) {
        body.roleids = (typeof (body.roleids == 'string') ? JSON.parse(body.roleids) : body.roleids)
        for (let i of body.roleids) {
            console.log("I------>", i);

            group.push(await groupService.getByRole(i));
        }
        console.log("Group----->", group);

        if (!group.includes(user.groupId)) {
            console.log("Not Authorized Group Case");

            throw new Error("Not Authorized Group");
        }
    } else {
        return {};
    }
}

const userGroupFilter = async (body, user) => {
    return {
        directStatement: ` where g.id='${user.groupId}'`,
        table: "user",
        queryStatement: "1=1",
        queryCondition: {}
    }
}

const collectionGroupAdmin = (body, user) => {
    console.log("Body----->", body);
    console.log("User----->", user);
    if ((body.pathParams || body.pathParams) != user.groupId) {
        throw new Error("Not Authorized Group");
    } else {
        return {};
    }
}

const collectionGroupFilter = (body,user) =>{
    return {
        directStatement: ` WHERE g.id='${user.groupId}'`,
        // table: "user",
        // queryStatement: "1=1",
        // queryCondition: {}
    }
}


export const config = {
    '/': {
        allowedMethods: ['GET'],
        GET: {
            allowedRoles: ['globalManager', 'manager', 'regular'],
            roles: {
                globalManager: {
                    filter: {
                        table: "user",
                        queryStatement: "1=1",
                        queryCondition: {}
                    },
                    permissions: {
                        hello: helloWorld
                    }
                },
                manager: {
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
                        table: "user",
                        queryStatement: "1=1",
                        queryCondition: {}

                    },
                    permissions: {
                        access: userAdmin
                    }
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
                    permissions: {
                        access: userAdmin
                    }
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
                        table: "user",
                        queryStatement: "1=1",
                        queryCondition: {}

                    },
                    permissions: {
                        access: userAdmin
                    }
                }
            }
        },
        POST: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                }
            }
        },
        PUT: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                }
            }
        },
        DELETE: {
            allowedRoles: ['globalManager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                }
            }
        }
    },
    '/collection': {
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        GET: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    // filter: {
                    //     table: "user",
                    //     queryStatement: "1=1",
                    //     queryCondition: {}
                    // },
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: collectionGroupFilter
                    }
                }
            }
        },
        POST: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: collectionGroupAdmin
                    }
                }
            }
        },
        PUT: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: collectionGroupAdmin
                    }
                }
            }
        },
        DELETE: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: collectionGroupAdmin
                    }
                }
            }
        }
    },
    '/user': {
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        GET: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    filter: {
                        table: "user",
                        queryStatement: "1=1",
                        queryCondition: {}
                    },
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: userGroupFilter
                    }
                }
            }
        },
        POST: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: userGroupAdminAccess
                    }
                }
            }
        },
        PUT: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: userGroupAdminAccess
                    }
                }
            }
        },
        DELETE: {
            allowedRoles: ['globalManager', 'manager'],
            roles: {
                globalManager: {
                    permissions: {
                        access: userAdmin
                    }
                },
                manager: {
                    permissions: {
                        access: userGroupAdminAccess
                    }
                }
            }
        }
    },
}

export const apiBasePath = ['/', '/role', '/group']