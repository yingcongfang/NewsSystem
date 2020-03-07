import mongodb_client as client

def test_basic():
    db = client.get_db('test')
    db['demo1'].drop()
    assert db['demo1'].count() == 0
    db['demo1'].insert({
        'test': 123
    })
    assert db['demo1'].count() == 1
    # db.demo.drop()
    # assert db.demo.count() == 0
    print ("test basic pass")

if __name__ == "__main__":
    test_basic()